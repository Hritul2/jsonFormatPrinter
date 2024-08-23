import requests
import json

# Function to print the structure of the JSON and write it to a file
def print_format_to_file(data, indent="", file=None, seen_types=None):
    if seen_types is None:
        seen_types = set()

    if isinstance(data, dict):
        file.write(f"{indent}{{\n")
        for key, value in data.items():
            if key not in seen_types:
                file.write(f"{indent}  {key}:\n")
                seen_types.add(key)
            print_format_to_file(value, indent + "    ", file, seen_types)
        file.write(f"{indent}}}\n")
    elif isinstance(data, list):
        file.write(f"{indent}Array [\n")
        if len(data) > 0:
            print_format_to_file(data[0], indent + "  ", file, seen_types)
        file.write(f"{indent}]\n")
    else:
        data_type = type(data).__name__
        if data_type not in seen_types:
            file.write(f"{indent}{data_type}\n")
            seen_types.add(data_type)

def fetch_and_print_json_format_to_file(url, file_path):
    try:
        # Fetch the data from the URL
        response = requests.get(url)
        response.raise_for_status()

        # Extract the JSON data
        try:
            data = response.json()
        except json.JSONDecodeError:
            print("Error: The response is not valid JSON.")
            return

        # Write the format of the JSON data to the file
        with open(file_path, "w") as file:
            print_format_to_file(data, "", file)

        print(f"Data format written to {file_path}")

    except requests.RequestException as error:
        print(f"Error fetching data: {error}")

# Example usage
fetch_and_print_json_format_to_file(
    "https://backend.takeuforward.org/api/sheets/double/strivers_a2z_sheet",
    "dataFormat.txt"
)
