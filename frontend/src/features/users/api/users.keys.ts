export const usersKeys = {
	all: ["users"] as const,
	list: (page: number, search: string) =>
		["users", "list", page, search] as const,
} as const;
