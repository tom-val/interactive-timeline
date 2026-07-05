/** schema.org Person payload rendered on the home pages. */
export const PERSON_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tomas Valiūnas',
    jobTitle: 'Software Developer',
    url: 'https://valiunas.dev/',
    email: 'mailto:tomas@valiunas.dev',
    image: 'https://valiunas.dev/tomas-valiunas.jpg',
    sameAs: [
        'https://github.com/tom-val',
        'https://www.linkedin.com/in/tomas-valiunas-5a5a85114/',
    ],
    address: { '@type': 'PostalAddress', addressCountry: 'LT' },
    knowsAbout: ['.NET', 'PostgreSQL', 'React', 'TypeScript', 'AWS Lambda'],
}
