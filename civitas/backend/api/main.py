from openai import AzureOpenAI
import time
import logging
import re
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
import os
import json

# Enhanced logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('grading.log')
    ]
)
logger = logging.getLogger(__name__)

# --- CONFIGURATION ---
API_KEY = "Ax80ppCsRf3baI69t4Ww7WdIgE2ywqwmoxVQk8WXiX5rN2Q6bYv0JQQJ99BCACHYHv6XJ3w3AAAAACOGTC2b"
AZURE_ENDPOINT = "https://ai-graphitestorm8466ai385706727975.services.ai.azure.com"
API_VERSION = "2023-07-01-preview"
MODEL_NAME = "gpt-4o"

# Rate limiting configuration
RATE_LIMIT_TOKENS_PER_MINUTE = 60000
TOKEN_BUCKET_SIZE = RATE_LIMIT_TOKENS_PER_MINUTE
last_request_time = 0
tokens_available = TOKEN_BUCKET_SIZE

class RateLimitExceeded(Exception):
    """Exception raised when the rate limit is exceeded."""
    pass

def read_txt_as_block(filename):
    """Read file content as a single block of text."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            
            # Special handling for student_answers.txt which is in JSON format
            if filename == "student_answers.txt" and content.startswith('{'):
                try:
                    # Parse JSON and extract the text
                    json_data = json.loads(content)
                    if "extracted_text" in json_data:
                        logger.info("Successfully extracted text from JSON format")
                        return json_data["extracted_text"]
                except json.JSONDecodeError as e:
                    logger.warning(f"Failed to parse JSON in {filename}: {e}")
            
            return content
    except FileNotFoundError:
        logger.error(f"File not found: {filename}")
        raise
    except Exception as e:
        logger.error(f"Error reading file {filename}: {e}")
        raise

def parse_student_answers(student_text):
    """Extract student answers from the JSON-extracted text."""
    answers = {}
    
    # Extract questions using regex
    # This pattern looks for "Question X (Y marks" or "Question X Y marks)"
    question_pattern = r'Question\s+(\d+)\s+(?:\((\d+)\s+marks?|(\d+)\s+marks?\))\s*(.*?)(?=Question\s+\d+|$)'
    matches = re.findall(question_pattern, student_text, re.DOTALL)
    
    for match in matches:
        q_id = match[0]
        # Handle both formats: (10 marks) and 10 marks)
        marks = match[1] if match[1] else match[2]
        answer = match[3]
        
        # Clean up the answer text
        cleaned_answer = re.sub(r'\s+', ' ', answer.strip())
        cleaned_answer = re.sub(r'[|I]', '', cleaned_answer)  # Remove vertical bars and capital I
        
        # Store the answer
        answers[q_id] = cleaned_answer
        logger.info(f"Extracted answer for Question {q_id}")
    
    return answers

def parse_answer_key(answer_key_text):
    """Extract questions and marks from the answer key."""
    questions = {}
    
    # Try different patterns to match answer key
    patterns = [
        # Pattern for "Q1 (5 marks):" format
        r'Q(\d+)\s+\((\d+)\s+marks?\):?\s*(.*?)(?=Q\d+\s+\(\d+\s+marks?\)|$)',
        # Pattern for "Question 1 (5 marks):" format
        r'Question\s+(\d+)\s+\((\d+)\s+marks?\):?\s*(.*?)(?=Question\s+\d+\s+\(\d+\s+marks?\)|$)'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, answer_key_text, re.DOTALL)
        if matches:
            for q_id, marks, answer in matches:
                # Clean up the answer text
                cleaned_answer = re.sub(r'\s+', ' ', answer.strip())
                questions[q_id] = {
                    'marks': int(marks),
                    'answer': cleaned_answer
                }
            
            # If we found matches with this pattern, no need to try others
            break
    
    return questions

def update_token_bucket(estimated_tokens):
    """Update token bucket for rate limiting."""
    global last_request_time, tokens_available
    
    current_time = time.time()
    time_passed = current_time - last_request_time
    
    # Refill tokens based on time passed (proportional to tokens per minute)
    if last_request_time > 0:
        tokens_refill = min(
            (time_passed / 60.0) * RATE_LIMIT_TOKENS_PER_MINUTE,
            TOKEN_BUCKET_SIZE - tokens_available
        )
        tokens_available += tokens_refill
    
    # Check if enough tokens
    if tokens_available < estimated_tokens:
        wait_time = ((estimated_tokens - tokens_available) / 
                    RATE_LIMIT_TOKENS_PER_MINUTE) * 60
        logger.warning(f"Rate limit reached. Need to wait {wait_time:.2f} seconds")
        raise RateLimitExceeded(f"Rate limit exceeded. Retry after {wait_time:.2f} seconds")
    
    # Update state
    tokens_available -= estimated_tokens
    last_request_time = current_time
    logger.info(f"Tokens remaining in bucket: {tokens_available}")

@retry(
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(5),
    retry=retry_if_exception_type((RateLimitExceeded, Exception)),
    before_sleep=lambda retry_state: logger.info(f"Retrying in {retry_state.next_action.sleep} seconds...")
)
def call_azure_openai(prompt, estimated_tokens=3000):
    """Call Azure OpenAI with rate limiting."""
    try:
        # Apply rate limiting
        update_token_bucket(estimated_tokens)
        
        # Create client and make API call
        client = AzureOpenAI(
            api_key=API_KEY,
            api_version=API_VERSION,
            azure_endpoint=AZURE_ENDPOINT,
        )
        
        start_time = time.time()
        logger.info("Sending request to Azure OpenAI...")
        logger.info(f"Prompt length: {len(prompt)} characters")
        
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an AI grader."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        
        elapsed = time.time() - start_time
        logger.info(f"API call completed in {elapsed:.2f} seconds")
        
        content = response.choices[0].message.content
        logger.info(f"Received response of length: {len(content)} characters")
        
        # Print the actual response for debugging
        print("\n==== AI GRADER RESPONSE ====\n")
        print(content)
        print("\n===========================\n")
        
        return content
        
    except Exception as e:
        logger.error(f"API call failed: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        raise

def grade_answers(teacher_answer_key, student_answers):
    """Grade student answers by comparing to teacher's answer key."""
    # Parse the answer key and student answers
    parsed_key = parse_answer_key(teacher_answer_key)
    parsed_student = parse_student_answers(student_answers)
    
    # Check if we have data to process
    if not parsed_key:
        logger.error("No questions found in answer key")
        return {"error": "Could not parse answer key"}
    if not parsed_student:
        logger.error("No answers found in student submission")
        return {"error": "Could not parse student answers"}
    
    # Create batches of questions to process (to manage token usage)
    batch_size = 3  # Reduced from 5 to 3 questions per batch
    question_ids = sorted(parsed_key.keys(), key=int)
    batches = [question_ids[i:i+batch_size] for i in range(0, len(question_ids), batch_size)]
    
    # Initialize results dictionary
    results = {
        "grading_results": {},
        "summary": {
            "total_questions": len(parsed_key),
            "questions_answered": len(parsed_student),
            "total_marks_possible": sum(q["marks"] for q in parsed_key.values()),
            "total_marks_awarded": 0
        }
    }
    
    for batch in batches:
        # Create a targeted prompt for just the questions in this batch
        batch_prompt = """You are an AI grader. Your task is to evaluate student answers against the teacher's answer key.

IMPORTANT INSTRUCTIONS:
1. The student answers may contain formatting issues, line breaks, or special characters.
2. Focus on the semantic meaning and key concepts, not exact wording.
3. Be lenient with minor spelling or grammar errors.
4. Consider partial credit for answers that demonstrate partial understanding.
5. For each question, calculate a similarity score (0-100%) based on how well the student captured the key concepts.
6. Always provide a single sentence reasoning that explains why the student received the marks they did - focus on key concepts present or missing.

Grade the following questions:

"""
        
        for q_id in batch:
            if q_id in parsed_student:
                batch_prompt += f"Question {q_id} (Total marks: {parsed_key[q_id]['marks']})\n"
                batch_prompt += f"Teacher answer: {parsed_key[q_id]['answer']}\n"
                batch_prompt += f"Student answer: {parsed_student[q_id]}\n\n"
        
        batch_prompt += """For each question, calculate semantic similarity (0-100%) and award proportional marks.
Use this format:
Q<ID>:
→ Total Marks     : <marks>
→ Answer Key      : <teacher_answer>
→ Student Answer  : <student_answer>
→ Similarity      : <similarity>%
→ Marks Awarded   : <marks_awarded>/<total_marks>
→ Reasoning       : <single sentence explanation of why these marks were awarded, with no special characters or formatting>"""
        
        # Estimate tokens for this batch
        estimated_tokens = len(batch_prompt) // 4  # Rough estimation
        
        # Process this batch
        logger.info(f"Processing batch with questions: {batch}")
        batch_result = call_azure_openai(batch_prompt, estimated_tokens)
        
        # Parse the batch result and add to results dictionary
        for q_id in batch:
            if q_id in parsed_student:
                # Extract information from the batch result
                q_pattern = f"Q{q_id}:"
                q_section = re.search(f"{q_pattern}(.*?)(?=Q\\d+:|$)", batch_result, re.DOTALL)
                
                if q_section:
                    q_text = q_section.group(1).strip()
                    
                    # Print the raw text for debugging
                    print(f"\nRaw text for Q{q_id}:")
                    print(q_text)
                    
                    # Extract total marks - using a more robust pattern
                    total_marks_match = re.search(r"Total Marks\s*:\s*(\d+)", q_text)
                    total_marks = int(total_marks_match.group(1)) if total_marks_match else parsed_key[q_id]["marks"]
                    
                    # Extract similarity - using a more robust pattern
                    similarity_match = re.search(r"Similarity\s*:\s*(\d+(?:\.\d+)?)\s*%", q_text)
                    similarity = float(similarity_match.group(1)) if similarity_match else 0.0
                    
                    # Extract marks awarded - using a more robust pattern
                    marks_awarded_match = re.search(r"Marks Awarded\s*:\s*(\d+(?:\.\d+)?)/(\d+)", q_text)
                    marks_awarded = float(marks_awarded_match.group(1)) if marks_awarded_match else 0.0
                    
                    # Extract reasoning - using multiple patterns to be robust
                    reasoning = ""
                    reasoning_patterns = [
                        r"Reasoning\s*:\s*(.*?)(?=(?:Q\d+:|$))",
                        r"Justification\s*:\s*(.*?)(?=(?:Q\d+:|$))",
                        r"Explanation\s*:\s*(.*?)(?=(?:Q\d+:|$))",
                        r"Comments\s*:\s*(.*?)(?=(?:Q\d+:|$))"
                    ]

                    # Try each pattern to find reasoning
                    for pattern in reasoning_patterns:
                        reasoning_match = re.search(pattern, q_text, re.DOTALL)
                        if reasoning_match:
                            reasoning = reasoning_match.group(1).strip()
                            break

                    # If we still didn't find reasoning, try to extract any content after the marks awarded
                    if not reasoning:
                        marks_awarded_pos = q_text.find("Marks Awarded")
                        if marks_awarded_pos > 0:
                            # Find the next line after marks awarded
                            next_line_pos = q_text.find("\n", marks_awarded_pos)
                            if next_line_pos > 0:
                                reasoning = q_text[next_line_pos:].strip()
                    
                    # Clean the reasoning to be just one sentence and remove special characters
                    if reasoning:
                        # Split by periods and take the first sentence
                        reasoning_sentences = reasoning.split('.')
                        if reasoning_sentences:
                            reasoning = reasoning_sentences[0].strip() + '.'
                        
                        # Remove special characters and formatting
                        reasoning = re.sub(r'[\*\#\→\-\_\|\n\r\t]', '', reasoning)
                        reasoning = re.sub(r'\s+', ' ', reasoning)
                    
                    # If we couldn't extract values properly, try a more direct approach
                    if similarity == 0.0 or marks_awarded == 0.0:
                        # Try to find any number followed by % for similarity
                        similarity_matches = re.findall(r"(\d+(?:\.\d+)?)\s*%", q_text)
                        if similarity_matches:
                            similarity = float(similarity_matches[0])
                        
                        # Try to find any fraction for marks awarded
                        marks_matches = re.findall(r"(\d+(?:\.\d+)?)/(\d+)", q_text)
                        if marks_matches:
                            marks_awarded = float(marks_matches[0][0])
                            total_marks = float(marks_matches[0][1])
                    
                    # Safe logging that avoids encoding issues
                    logger.info(f"Question {q_id} - Marks: {total_marks}, Similarity: {similarity}%, Awarded: {marks_awarded}")
                    logger.info(f"Reasoning found: {'Yes' if reasoning else 'No'}")
                    
                    # Add to results - without teacher and student answers
                    results["grading_results"][q_id] = {
                        "total_marks": total_marks,
                        "similarity_percentage": similarity,
                        "marks_awarded": marks_awarded,
                        "reasoning": reasoning
                    }
                    
                    # Update summary
                    results["summary"]["total_marks_awarded"] += marks_awarded
        
        # Be gentle with the API - increased delay between batches
        time.sleep(5)  # Increased from 1 to 5 seconds
    
    # Calculate final percentage
    if results["summary"]["total_marks_possible"] > 0:
        results["summary"]["percentage_score"] = (results["summary"]["total_marks_awarded"] / 
                                                 results["summary"]["total_marks_possible"]) * 100
    else:
        results["summary"]["percentage_score"] = 0
    
    return results

#def main():
#    try:
#        logger.info("Starting grading process...")
#        
#        # Read files
#        logger.info("Reading input files...")
#        teacher_txt = read_txt_as_block("answer_key.txt")
#        student_txt = read_txt_as_block("student_answers.txt")
#        
#        logger.info(f"Teacher answer key length: {len(teacher_txt)} characters")
#        logger.info(f"Student answers length: {len(student_txt)} characters")
#        
#        # Grade the answers
#        logger.info("Starting grading process...")
#        results = grade_answers(teacher_txt, student_txt)
#        
#        # Output results
#        print("\n==== GRADING RESULTS ====\n")
#        print(json.dumps(results, indent=2))
#        print("\n========================\n")
#        
#        # Save results to JSON file
#        logger.info("Saving results to JSON file...")
#        with open("grading_results.json", "w", encoding="utf-8") as f:
#            json.dump(results, f, indent=2)
#        logger.info("Grading results saved to grading_results.json")
#        
#    except Exception as e:
#        logger.error(f"An error occurred: {str(e)}", exc_info=True)
#        raise
#
#if __name__ == "__main__":
#    main()