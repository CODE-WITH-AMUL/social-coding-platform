import pandas as pd

# load the dataset 

data = pd.read_csv('data/train.csv')

# print(data)

# Let us view the first five row in the dataset.

print(data.head(5))\

# now for the baic stats for the dataset

print(data.describe())