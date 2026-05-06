import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			// ── Formatting ────────────────────────────────────────────────
			'quotes': ['error', 'single', { avoidEscape: true }],
			'semi': ['error', 'never'],
			'indent': ['error', 'tab'],
			'no-tabs': 'off',

			// ── Style ─────────────────────────────────────────────────────
			'comma-dangle': ['error', 'never'],
			'eol-last': ['error', 'always'],
			'no-trailing-spaces': 'error',
			'object-curly-spacing': ['error', 'always'],
			'keyword-spacing': ['error', { before: true, after: true }],
			'space-infix-ops': 'error',
			'arrow-spacing': ['error', { before: true, after: true }],

			// ── TypeScript ────────────────────────────────────────────────
			'@typescript-eslint/no-explicit-any': 'off'
		}
	},
	{
		ignores: ['dist/']
	}
)
