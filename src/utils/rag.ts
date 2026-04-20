import knowledgeBase from '@/data/knowledge_base.json';

interface KnowledgeItem {
    id: string;
    category: string;
    keywords: string[];
    content: string;
}

export function getRelevantContext(query: string, limit: number = 2): string {
    const lowerQuery = query.toLowerCase();

    // Simple keyword matching score
    const scoredItems = (knowledgeBase as KnowledgeItem[]).map(item => {
        let score = 0;
        item.keywords.forEach(keyword => {
            if (lowerQuery.includes(keyword.toLowerCase())) {
                score += 1;
            }
        });
        return { item, score };
    });

    // Sort by score and filter out zero scores
    const relevantItems = scoredItems
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(si => si.item.content);

    return relevantItems.join('\n\n');
}
