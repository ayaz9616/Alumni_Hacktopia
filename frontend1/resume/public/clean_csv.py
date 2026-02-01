import csv
import json

# Read the CSV
with open('alumni_export_2025-11-05.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

# Parse and clean the data
cleaned_data = []
for row in rows:
    try:
        # Parse JSON fields
        batch_str = row.get('batch', '{}')
        batch_year = ''
        if batch_str and batch_str.startswith('{'):
            batch_year = json.loads(batch_str).get('year', '')
        
        course_str = row.get('course', '{}')
        course_name = ''
        if course_str and course_str.startswith('{'):
            course_name = json.loads(course_str).get('name', '')
        
        lives_in_str = row.get('livesIn', '{}')
        lives_in = ''
        if lives_in_str and lives_in_str.startswith('{'):
            lives_in = json.loads(lives_in_str).get('city', '')
        
        home_town_str = row.get('homeTown', '{}')
        home_town = ''
        if home_town_str and home_town_str.startswith('{'):
            home_town = json.loads(home_town_str).get('city', '')
        
        social_str = row.get('social', '{}')
        linkedin = ''
        if social_str and social_str.startswith('{'):
            linkedin = json.loads(social_str).get('linkedin', '')
        
        parsed_row = {
            'id': row.get('id', ''),
            'name': row.get('name', ''),
            'email': row.get('email', ''),
            'rollno': row.get('rollno', ''),
            'batch': batch_year,
            'course': course_name,
            'experience': row.get('experience', ''),
            'livesIn': lives_in,
            'homeTown': home_town,
            'linkedin': linkedin,
        }
        cleaned_data.append(parsed_row)
    except Exception as e:
        print(f'Error parsing row: {e}')
        continue

# Write cleaned CSV
with open('alumni_cleaned.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['id', 'name', 'email', 'rollno', 'batch', 'course', 'experience', 'livesIn', 'homeTown', 'linkedin'])
    writer.writeheader()
    writer.writerows(cleaned_data)

print(f'Cleaned {len(cleaned_data)} alumni records and saved to alumni_cleaned.csv')
