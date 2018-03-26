import loadFromEnvironment from '../environ';
import Metadata from '../../metadata';


describe('loadFromEnvironment', () => {

    beforeAll(() => {
        process.env.TEST__GROUP__VARIABLE = 'X';
        process.env.TEST__VARIABLE = 'Y';
        process.env.TEST__BOOL_VARIABLE_FALSE = '0';
        process.env.TEST__BOOL_VARIABLE_TRUE = '1';
        process.env.TEST__BOOL_VARIABLE_FALSE_LITERAL = 'False';
        process.env.TEST__BOOL_VARIABLE_TRUE_LITERAL = 'True';
        process.env.TEST__BOOL_VARIABLE_FALSE_LITERAL_D = 'false';
        process.env.TEST__BOOL_VARIABLE_TRUE_LITERAL_D = 'true';
    });

    it('should have the correct configuration', () => {
        const config = loadFromEnvironment(new Metadata('test'));

        expect(config).toEqual({
            boolVariableFalse: false,
            boolVariableTrue: true,
            boolVariableFalseLiteral: false,
            boolVariableTrueLiteral: true,
            boolVariableFalseLiteralD: false,
            boolVariableTrueLiteralD: true,
            group: {
                variable: 'X',
            },
            variable: 'Y',
        });
    });

    it('should filter out non-matching variables', () => {
        const config = loadFromEnvironment(new Metadata('other'));

        expect(config).toEqual({
        });
    });
});
