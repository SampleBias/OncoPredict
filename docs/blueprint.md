# **App Name**: OncoPredict

## Core Features:

- User Authentication: Secure user authentication and authorization.
- Patient Data Input: Input fields for age, gender, CNA events, and genetic mutations.
- Data Formatting: Formulate a prompt including patient data for the AI model.  Acts as a tool that formats the data for analysis.
- Results Presentation: Presents ranked cancer types with probability percentages.
- Prediction History: Stores the input data and results for future reference

## Style Guidelines:

- Primary color: White or light gray for a clean, professional look.
- Secondary color: A calming blue (#3498db) to represent trust and reliability.
- Accent: A subtle teal (#2ecc71) to highlight important information and CTAs.
- Clean and structured layout with clear sections for data input and results.
- Use medical-themed icons to represent different data types and functionalities.

## Original User Request:
I need to build;
# Open Nexus: Cancer Type Prediction Platform

## What It Does

Open Nexus is a specialized medical application that helps healthcare professionals predict cancer types based on patient genomic and clinical data. The platform analyzes information such as age, gender, Copy Number Alteration (CNA) events, and genetic mutations to provide probability estimates for different cancer types.

## How It Works

The application operates through a web interface with these key features:

1. **User Authentication**: Healthcare professionals register and log in to access the system, ensuring patient data remains secure and predictions are tracked properly.

2. **Cancer Type Prediction**: Once logged in, users can submit patient data including:
   - Demographic information (age, gender)
   - Genomic data (CNA events, genetic mutations)

3. **Advanced Analysis**: Behind the scenes, the application processes this information using:
   - A sophisticated AI model (GPT-4) that acts as an "expert oncologist"
   - The system formats patient data into a structured prompt
   - The AI analyzes patterns in the genomic markers and clinical factors

4. **Results Presentation**: The system returns:
   - A ranked list of potential cancer types
   - Probability percentages for each type
   - These probabilities always sum to 100% for easy interpretation

5. **Prediction History**: Users can review all their previous predictions, which helps with:
   - Tracking patient progress over time
   - Comparing results across similar cases
   - Maintaining medical records

## Where It Gets Its Data

The application relies on three main data sources:

1. **User-Provided Patient Data**: Healthcare professionals enter specific patient information:
   - Clinical data like age and gender
   - Specialized genomic data including CNA events (changes in the number of copies of DNA segments) and specific genetic mutations

2. **MongoDB Database**: The system stores:
   - User account information (securely hashed passwords)
   - Complete history of all predictions
   - The input data and results for future reference

3. **Google gemini**: For analysis, the system:
   - Connects to OpenAI's API using a secured API key
   - Leverages the advanced language model to interpret complex medical data
   - Uses carefully crafted prompts designed for oncology applications

The application follows healthcare security best practices with rate limiting to prevent abuse, secure authentication, and structured data validation to ensure accurate predictions.

This platform essentially bridges the gap between raw genomic data and clinical cancer diagnosis, providing healthcare professionals with an AI-powered second opinion that can help guide treatment decisions.
  