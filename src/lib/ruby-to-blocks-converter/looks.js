/* global Opal */
import _ from 'lodash';

/* eslint-disable no-invalid-this */
const createBlockWithMessage = function (opcode, message, defaultMessage) {
    const block = this._createBlock(opcode, 'statement');
    this._addTextInput(block, 'MESSAGE', _.isNumber(message) ? message.toString() : message, defaultMessage);
    return block;
};
/* eslint-enable no-invalid-this */

/**
 * Looks converter
 */
const LooksConverter = {
    // eslint-disable-next-line no-unused-vars
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock) {
        let block;
        if (this._isSelf(receiver) || receiver === Opal.nil) {
            switch (name) {
            case 'say':
            case 'think':
                if ((args.length === 1 && this._isNumberOrStringOrBlock(args[0])) ||
                    (args.length === 2 &&
                     this._isNumberOrStringOrBlock(args[0]) &&
                     this._isNumberOrBlock(args[1]))) {
                    let opcode;
                    let defaultMessage;
                    if (name === 'say') {
                        opcode = 'looks_say';
                        defaultMessage = 'Hello!';
                    } else {
                        opcode = 'looks_think';
                        defaultMessage = 'Hmm...';
                    }
                    block = createBlockWithMessage.call(this, opcode, args[0], defaultMessage);
                    if (args.length === 2) {
                        block.opcode += 'forsecs';
                        this._addNumberInput(block, 'SECS', 'math_number', args[1], 2);
                    }
                }
                break;
            }
        }
        return block;
    }
};

export default LooksConverter;
