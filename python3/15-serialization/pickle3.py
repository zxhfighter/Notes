import pickle, pickletools

def protocal_version(file_object):
    maxproto = -1
    for opcode, arg, pos in pickletools.genops(file_object):
        maxproto = max(maxproto, opcode.proto)
    return maxproto

def main():
    with open('entry.pickle', 'rb') as f:
        print('v = {}'.format(protocal_version(f)))
        # pickletools.dis(f)

if __name__ == '__main__':
    main()
