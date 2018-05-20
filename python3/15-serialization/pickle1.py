import pickle, time

pickle_filename = 'entry.pickle'

def build_entry():
    entry = {}
    entry['title'] = 'Dive into history, 2009 edition'
    entry['comments_link'] = None
    entry['internal_id'] = b'\xDE\xD5\xB4\xF8'
    entry['tags'] = ('diveintopython', 'docbook', 'html')
    entry['published'] = True
    entry['published_date'] = time.strptime('Fri Mar 27 22:20:42 2009')
    return entry

def save_entry(entry):
    with open(pickle_filename, 'wb') as f:
        pickle.dump(entry, f)

def read_entry():
    with open(pickle_filename, 'rb') as f:
        entry = pickle.load(f)
        print(entry)
        return entry

def main():
    entry1 = build_entry()
    save_entry(entry1)
    entry2 = read_entry()

    print('entry2 == entry1 ? {}'.format(entry1 == entry2))
    print('entry2 is entry1 ? {}'.format(entry2 is entry1))

if __name__ == '__main__':
    main()
