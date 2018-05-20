import json, time
import customserializer

pickle_filename = 'entry.json'

def build_entry():
    entry = {}
    entry['id'] = 256
    entry['title'] = 'Dive into history, 2009 edition'
    entry['comments_link'] = None
    entry['tags'] = ('diveintopython', 'docbook', 'html')
    entry['published'] = True
    entry['internal_id'] = b'\xDE\xD5\xB4\xF8'
    entry['published_date'] = time.strptime('Fri Mar 27 22:20:42 2009')
    return entry

def save_entry(entry):
    with open(pickle_filename, mode='w', encoding='utf-8') as f:
        json.dump(entry, f, indent=2, default=customserializer.to_json)

def read_entry():
    with open(pickle_filename, mode='r', encoding='utf-8') as f:
        entry = json.load(f, object_hook=customserializer.from_json)
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
