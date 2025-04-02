import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest.js";
import { staticStories, defaultImages } from "./storiesConstants";
import "./DiscoverMoreStories.scss";

const DiscoverMoreStories = () => {
    const [filter, setFilter] = useState('all');
    const [apiStories, setApiStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        'all', 'adventure', 'food', 'nightlife',
        'history', 'nature', 'spiritual'
    ];

    const filteredStories = [
        ...staticStories,
        ...apiStories
    ].filter(story =>
        filter === 'all' ? true : story.category === filter
    );

    const getStoryImage = (story) => {
        if (story.img) return story.img;
        const randomIndex = Math.floor(Math.random() * defaultImages.length);
        return defaultImages[randomIndex];
    };

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await newRequest.get('/story');
                setApiStories(response.data);
            } catch (error) {
                console.error('Error fetching stories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (isLoading) return <div className="loading">Loading...</div>;

    return (
        <section className="discover-stories">
            <div className="container">
                <div className="row section-header">
                    <div className="col-xl-6 col-lg-8">
                        <div className="title-area">
                            <span className="sec-subtitle">Real Experiences</span>
                            <h2 className="sec-title">Traveler Stories with Blablatrip</h2>
                            <p className="sec-text">
                                Discover how our travelers connected with local Ambassadors to create authentic and
                                meaningful travel experiences around the world.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="filter-buttons">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`filter-btn ${filter === category ? 'active' : ''}`}
                                    onClick={() => setFilter(category)}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row">
                    {filteredStories.length > 0 ? (
                        filteredStories.map((story) => (
                            <div key={story.id} className="col-lg-6">
                                <div className="story-card">
                                    <div className="blog-img">
                                        <Link to={`/story-details/${story.id}`}>
                                            <img
                                                src={getStoryImage(story)}
                                                alt={story.title}
                                            />
                                        </Link>
                                        <span className="category-badge">
                      {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                    </span>
                                    </div>

                                    <div className="blog-content">
                                        <div className="meta-info">
                                            <div>
                                                <i className="fas fa-map-marker-alt"></i>
                                                {story.location}
                                            </div>
                                            <div>
                                                <i className="fas fa-user"></i>
                                                Ambassador: {story.ambassador}
                                            </div>
                                        </div>

                                        <h2 className="blog-title">
                                            <Link to={`/story-details/${story.id}`}>{story.title}</Link>
                                        </h2>

                                        <p className="blog-text">{story.snippet}</p>

                                        <div className="blog-bottom">
                                            <div className="blog-date">
                                                <i className="fas fa-calendar-alt"></i>
                                                {story.date}
                                            </div>
                                            <Link className="vs-btn" to={`/story-details/${story.id}`}>
                                                Read Full Story <i className="fas fa-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 no-stories-message">
                            <p>No stories found in this category. Please try another filter.</p>
                        </div>
                    )}
                </div>

                <div className="row">
                    <div className="col-12 share-experience-cta">
                        <h3>Share Your Blablatrip Experience</h3>
                        <p>
                            Have you traveled with a Blablatrip Ambassador? We'd love to hear your story and share
                            it with our community!
                        </p>
                        <Link to="/share-story" className="vs-btn">
                            Submit Your Story
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DiscoverMoreStories;