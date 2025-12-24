export const getInitials = (name?: string): string => {
    if (!name || name.trim() === "") return "";

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    const firstInitial = words[0].charAt(0);
    const secondInitial = words[1].charAt(0);

    return (firstInitial + secondInitial).toUpperCase();
};