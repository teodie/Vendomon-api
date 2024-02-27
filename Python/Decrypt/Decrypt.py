import subprocess
js_decrypt = './Decrypt/decriypt.js'

# Decrypt the password
def decrypt(password):
    
    try:
        # Run the JavaScript script using Node.js
        result = subprocess.run(['node', js_decrypt, password], capture_output=True, text=True, check=True)

        # Get the output
        output = result.stdout.strip()

        return output

    except subprocess.CalledProcessError as e:
        # Handle errors, if any
        print(f"Error is: {e}")
        return None
