// script.js

// Function for the main Parent Accordion (Rotates the SVG Arrow)
function toggleAccordion(contentId, arrowId) {
    const content = document.getElementById(contentId);
    const arrow = document.getElementById(arrowId);
    
    // We keep max-h-[2000px] so the parent container has room for children to expand
    if (content.classList.contains('max-h-0')) {
        content.classList.remove('max-h-0', 'opacity-0');
        content.classList.add('max-h-[2000px]', 'opacity-100');
        if (arrow) arrow.classList.add('rotate-180');
    } else {
        content.classList.remove('max-h-[2000px]', 'opacity-100');
        content.classList.add('max-h-0', 'opacity-0');
        if (arrow) arrow.classList.remove('rotate-180');
    }
}

// Function for the Timeline nodes (Fills in the Dot)
function toggleTimeline(contentId, dotId) {
    const content = document.getElementById(contentId);
    const dot = document.getElementById(dotId);
    
    if (content.classList.contains('max-h-0')) {
        // Expand the content
        content.classList.remove('max-h-0', 'opacity-0');
        content.classList.add('max-h-[500px]', 'opacity-100');
        
        // Fill the hollow dot with color
        if (dot) {
            dot.classList.remove('bg-white');
            dot.classList.add('bg-sky-500');
        }
    } else {
        // Collapse the content
        content.classList.remove('max-h-[500px]', 'opacity-100');
        content.classList.add('max-h-0', 'opacity-0');
        
        // Return the dot to hollow state
        if (dot) {
            dot.classList.remove('bg-sky-500');
            dot.classList.add('bg-white');
        }
    }
}
// Fetch latest Medium Articles dynamically
async function fetchMediumArticles() {
    const username = '@adityakumarsoni';
    // We use rss2json to bypass CORS issues and convert the RSS XML into clean JSON
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${username}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status === 'ok') {
            const articlesContainer = document.getElementById('medium-articles');
            articlesContainer.innerHTML = ''; // Clear the "Fetching..." loading text
            
            // Slice the array to only get the top 2 most recent articles
            const articles = data.items.slice(0, 2);
            
            articles.forEach(article => {
                // Create a temporary element to safely strip HTML tags from the Medium description
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = article.description;
                let textContent = tempDiv.textContent || tempDiv.innerText || "";
                
                // Truncate the description to roughly 120 characters for a clean preview
                let shortDesc = textContent.substring(0, 120) + '...';

                // Grab the first tag/category used on Medium, fallback to 'Engineering' if none exist
                const tag = article.categories.length > 0 ? article.categories[0] : 'Engineering';
                
                // Format the publish date to look like "Aug 11, 2026"
                const pubDate = new Date(article.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                // Construct the HTML for the card
                const articleHTML = `
                    <a href="${article.link}" target="_blank" class="group flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition h-full">
                        <div>
                            <div class="flex items-center gap-3 mb-4">
                                <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">${tag}</span>
                                <span class="text-xs text-slate-400 font-medium">${pubDate}</span>
                            </div>
                            <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition leading-snug">${article.title}</h3>
                            <p class="text-sm text-slate-600 leading-relaxed font-light">${shortDesc}</p>
                        </div>
                        <div class="mt-5 text-sm font-medium text-blue-600 group-hover:text-blue-800 transition flex items-center gap-1">
                            Read article <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                    </a>
                `;
                
                // Inject the card into the grid
                articlesContainer.innerHTML += articleHTML;
            });
        }
    } catch (error) {
        console.error("Error fetching Medium articles:", error);
        document.getElementById('medium-articles').innerHTML = `
            <p class="text-sm text-slate-500">Could not load articles at this time. <a href="https://adityakumarsoni.medium.com/" target="_blank" class="text-blue-600 underline">Visit my Medium profile directly.</a></p>
        `;
    }
}

// Fire the function as soon as the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchMediumArticles);