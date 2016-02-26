import numpy as np
import random
import json
import requests

# set up an array of random length filled with random numbers
length = random.randrange(2,20)
numbers = np.ndarray(shape=length, dtype=np.int32)
#numbers = np.ndarray(shape=length, dtype=np.float32)
for x, value in np.ndenumerate(numbers):
    num = random.randint(0, 99)
    #num = random.uniform(0, 99)
    numbers[x] = num

# create JSON object and pass to web service
obj = json.dumps(numbers.tolist())
print("Original array of numbers:")
print(obj)

print("\n\nAccessing remote server...")
try:
    # access server and pass to it JSON object
    r = requests.get("http://localhost:3000", params=obj)
    # display the sorted array
    obj = str.replace(r.text, ",", ", ")
    print("\n\nSorted array of numbers:")
    print(obj)
except:
    print("\n\nError accessing server")
    print("\nMake sure server is running by navigating to Backend directory")
    print("and executing 'node server.js'")
