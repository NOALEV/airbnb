# -*- coding: utf-8 -*-
"""
Created on Thu May 24 21:19:05 2018

@author: aviya
"""

#%%

name = "aviya"
# print("hello",name)

import pickle, json, sys

# Load model

pkl = open('C:\\Users\\noaal\\OneDrive\\שולחן העבודה\\airbnb_final\\api\\algorithem\\model.pkl', 'rb')
model = pickle.load(pkl)
pkl.close()

# Prepare data to predict on

# Each input is an array of integers.
# The first three values (accomodates, bedrooms, bathrooms) can take any integer value.
# Thre rest are (Kitchen, Heating, ..., cancellation_policy_super_strict_60) are booleans,
# where 0 means False and 1 means True.
# The meaning of the values is as follows (in order):

# Value meaning                                      Example
# ------------------------------------------------------------
# accommodates                                       3 
# bedrooms                                           1
# bathrooms                                          1
# Kitchen                                            1
# Heating                                            1
# Hair dryer                                         1
# Laptop friendly workspace                          1
# Hangers                                            1
# Iron                                               1
# Shampoo                                            1
# Hot water                                          1
# Family/kid friendly                                1
# Refrigerator                                       1
# Dishes and silverware                              1
# Elevator                                           0
# Cooking basics                                     1
# Stove                                              1
# Oven                                               0
# Washer                                             0
# Dryer                                              0
# Coffee maker                                       1
# Dishwasher                                         1
# Patio or balcony                                   0
# Microwave                                          1
# parking                                            0
# Bathtub                                            1
# Wifi|Internet                                      1
# TV                                                 1
# linen|pillow|blanket                               1
# room_type_Entire home/apt                          1
# room_type_Private room                             0
# room_type_Shared room                              0
# bed_type_Airbed                                    0
# bed_type_Couch                                     0
# bed_type_Futon                                     0
# bed_type_Pull-out Sofa                             0
# bed_type_Real Bed                                  1
# cancellation_policy_flexible                       0
# cancellation_policy_moderate                       0
# cancellation_policy_strict_14_with_grace_period    1
# cancellation_policy_super_strict_30                0
# cancellation_policy_super_strict_60                0

data = [
  [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0]
]
data=[[2,2,2,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1,1,0,1,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0]]
print(sys.stdin.readline()[0])
data = json.loads(sys.stdin.readlines()[0])

# The output is in US dollars
print(json.dumps(model.predict(data).tolist()))

# For multiple inputs:
#data = [
#    [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
#    [2, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
#    [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0]
#]

# Predictions are in the same order as the inputs
#print(model.predict(data))



