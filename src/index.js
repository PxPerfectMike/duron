import fs from 'fs/promises';

// Function to interpret configuration and generate tests
function generateTests(config) {
    let testCode = '';

    // Generate a test for each function
    config.function.forEach((func) => {
        testCode += `
            test('${func.name}', () => {
                const result = require('${func.location}').${func.name}(${func.input});
                expect(result).toBe(${func.expectedOutcome});
            });
        `;
    });

    // Generate a test for each component
    config.component.forEach((comp) => {
        testCode += `
            test('${comp.name}', () => {
                const component = require('${comp.location}');
                expect(component).toBeTruthy();
            });
        `;
    });

    return testCode;
}

function interpretConfig(config) {
    const requiredFields = ['function', 'component'];

    requiredFields.forEach((field) => {
        if (!config[field]) {
            throw new Error(`Missing required field in config: ${field}`);
        }
    });

    // For each function, check that the required fields are present
    config.function.forEach((func) => {
        const requiredFunctionFields = [
            'name',
            'location',
            'input',
            'expectedOutcome',
        ];
        requiredFunctionFields.forEach((field) => {
            if (!func[field]) {
                throw new Error(
                    `Missing required field in function config: ${field}`,
                );
            }
        });
    });

    // For each component, check that the required fields are present
    config.component.forEach((comp) => {
        const requiredComponentFields = [
            'name',
            'location',
            'hasButtons',
            'canMount',
        ];
        requiredComponentFields.forEach((field) => {
            if (!comp[field]) {
                throw new Error(
                    `Missing required field in component config: ${field}`,
                );
            }
        });
    });

    // If we made it this far, the config is valid!
    return config;
}

// Main function to run the application
async function main() {
    try {
        // Load the JSON configuration file
        const data = await fs.readFile('./duronconfig.json', 'utf-8');
        const config = JSON.parse(data);

        // Interpret the configuration
        const interpretedConfig = interpretConfig(config);

        // Generate tests based on the configuration
        const testCode = generateTests(interpretedConfig);

        // Save the test code to a file
        await fs.writeFile('./generatedTests.js', testCode);

        // Run the tests
        const results = runTests('./generatedTests.js');

        // Print the results
        console.log(results);
    } catch (err) {
        console.error('An error occurred:', err);
    }
}

main().catch(console.error);
