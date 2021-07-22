import TurnDownService from "turndown";

const turnDownService = new TurnDownService();

export const getMarkdown = (html: string) => turnDownService.turndown(html);
