import argparse
from random import randint
import requests
from tqdm import tqdm


parser = argparse.ArgumentParser()
parser.add_argument('--start', required=True, type=int)
parser.add_argument('--stop', required=True, type=int)
parser.add_argument('--step', type=int, default=10000)
parser.add_argument('--host', required=True)
parser.add_argument('--sensorid', required=True, type=int)

args = parser.parse_args()

for timestamp in tqdm(range(args.start, args.stop, args.step)):
    data = {'sensorId': args.sensorid, 'sensorValue': randint(
        0, 1023), 'timestamp': timestamp}
    requests.post(args.host, json=data)
