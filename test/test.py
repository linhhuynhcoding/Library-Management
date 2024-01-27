import csv

# Read CSV with a different delimiter (e.g., pipe "|")
input_csv_file = 'assets/rootdatabook.csv'
output_csv_file = 'output.csv'
desired_delimiter = '|'

with open(input_csv_file, 'r', newline='', encoding='utf-8') as csvfile:
    # Specify the delimiter in the DictReader
    reader = csv.DictReader(csvfile, delimiter=desired_delimiter)

    # Write to a new CSV file with a different delimiter
    with open(output_csv_file, 'w', newline='', encoding='utf-8') as outfile:
        # Specify the delimiter in the DictWriter
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames, delimiter=desired_delimiter)

        # Write the header
        writer.writeheader()

        # Write the rows
        for row in reader:
            writer.writerow(row)

print(f'The CSV file with {desired_delimiter} delimiter has been created: {output_csv_file}')
