import { useState, useEffect } from 'react';
export default function FeatureCarousel() {
    const cards = [
        { id: 1, title: "What is VERDICT?", content: "Verdict is an AI-powered platform that brutally analyzes your app idea, UI, MVP, or live product and gives honest feedback, scores, weaknesses, and improvements." },
        { id: 2, title: "How does the AI review work?", content: "Verdict evaluates multiple parts of your product including\:UI\/UX\,originality\,usability\,execution\,scalability\,frontend/backend\, quality\,market relevance.\nThen it generates detailed feedback, roast-style criticism, and actionable solutions" },
        { id: 3, title: "What is the Roast Card feature?", content: "After every review, Verdict generates a shareable “Roast Card” containing\:\,overall score\,strongest strengths\,biggest flaws\,brutal one-line verdict\,visual score graphs.Users can share these cards with friends or on social media." },
        { id: 4, title: "What are Verdict Graphs and Scores?", content: "Verdict visually breaks down your product performance with score graphs for\:\,design\,frontend\,backend\,creativity\,usability\,market potential\,execution quality.This helps users quickly understand where their project succeeds or fails." },
        { id: 5, title: "What is the Community feature?", content: "Verdict Community allows users to:\,post their projects\,compare scores\,discuss improvements\,react to AI verdicts\,discover trending ideas\,participate in “best roast” challenges.It transforms product feedback into a public, competitive experience for builders." }
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                if (prevIndex === cards.length - 1) {
                    return 0;
                } else {
                    return prevIndex + 1;
                }
            });
        }, 5000);
        return () => clearInterval(timer);
    }, [cards.length]);

    return (
        <div className="carousel-container" style={{ border: '1px solid gray', padding: '2rem', marginTop: '2rem' }}>



            {/* 4. Display only the current card based on the state */}
            <div className="card">
                <h2>{cards[currentIndex].title}</h2>
                <p>{cards[currentIndex].content}</p>
            </div>
            {/* Optional: Show dots to indicate how many cards there are */}
            {/*<div style={{ display: 'flex', gap: '5px', marginTop: '1rem' }}>
                {cards.map((card, index) => (
                    <span
                        key={card.id}
                        style={{
                            fontWeight: currentIndex === index ? 'bold' : 'normal',
                            color: currentIndex === index ? 'red' : 'gray', backgroundColor: 'white',
                        }}
                    >
                        {index + 1}
                    </span>
                ))}
            </div>*/}
        </div>
    );
}
