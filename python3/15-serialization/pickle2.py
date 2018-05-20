import pickle
from pickle1 import build_entry

def main():
    entry1 = build_entry()
    b = pickle.dumps(entry1)
    entry2 = pickle.loads(b)

    print('entry2 == entry1 ? {}'.format(entry1 == entry2))
    print('entry2 is entry1 ? {}'.format(entry2 is entry1))

if __name__ == '__main__':
    main()
