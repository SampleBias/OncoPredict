# **App Name**: OncoPredict

## Core Features:

- User Authentication: Secure user authentication and authorization.
- Patient Data Input: Input fields for age, gender, CNA events, and genetic mutations.
  <!-- Future Consideration: Could be expanded to include pre-calculated features like mutational signatures, which require significant upstream bioinformatics processing (similar to approaches like OncoNPC). -->
- Data Formatting: Formulate a prompt including patient data for the AI model (currently Gemini). Acts as a tool that formats the data for analysis.
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
   <!-- Note: Current scope uses user-provided mutations/CNAs. More complex systems like OncoNPC process raw data into features including mutational signatures. -->

3. **Advanced Analysis**: Behind the scenes, the application processes this information using:
   - A sophisticated AI model (**Google Gemini**) that acts as an "expert oncologist"
     <!-- Current implementation uses Gemini for analysis based on the provided data. -->
   - The system formats patient data into a structured prompt for Gemini.
   - The AI analyzes patterns in the genomic markers and clinical factors provided in the prompt.

   <!-- 
   **Note on Alternative Approaches (Not Implemented):**
   Other systems, like OncoNPC, utilize different methodologies. They often rely on extensive preprocessing of raw genomic data (mutations, CNAs, mutational signatures) to create structured features. These features are then used to train machine learning models, such as **XGBoost**, for classification. This requires a dedicated bioinformatics pipeline and different modeling techniques than the current Gemini-based approach used in OncoPredict. Integrating such features or models like XGBoost is a potential future enhancement but is **not part of the current implementation**. 
   -->

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

3. **Google Gemini**: For analysis, the system:
   - Connects to Google's AI API using a secured API key
   - Leverages the advanced language model (Gemini) to interpret complex medical data based on the prompt.
   - Uses carefully crafted prompts designed for oncology applications

The application follows healthcare security best practices with rate limiting to prevent abuse, secure authentication, and structured data validation to ensure accurate predictions.

This platform essentially bridges the gap between raw genomic data and clinical cancer diagnosis, providing healthcare professionals with an AI-powered second opinion that can help guide treatment decisions.
