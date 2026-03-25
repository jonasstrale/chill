.PHONY: up down policy verify

up:
	pnpm compose:up

down:
	pnpm compose:down

policy:
	pnpm policy:check

verify:
	pnpm verify
