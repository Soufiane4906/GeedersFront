import React, { useEffect, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import Loading from "../../components/loading/Loading";
import InteractiveMap from "../../components/InteractiveMap";

const formatDate = (dateString) => {
  const parsedDate = parseISO(dateString);
  return format(parsedDate, 'dd/MM/yyyy ');
};

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const country = queryParams.get('country') || "";
  const city = queryParams.get('city') || "";

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", sort, country, city],
    queryFn: () =>
        newRequest
            .get(`/gigs?country=${country}&city=${city}&sort=${sort}`)
            .then((res) => res.data),
  });

  const locations = data ? data.map(gig => ({
    _id: gig._id,
    title: gig.title,
    latitude: gig.latitude,
    longitude: gig.longitude,
    description: gig.desc,
  })) : [];

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort, country, city]);

  const apply = () => {
    refetch();
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const noResultsMessage = "No matching guides found in these areas.";

  return (
      <div className="gigs">
        <div className="container">
          <span className="breadcrumbs">Search Results</span>
          <h1>Available Ambassadors</h1>
          <div className="menu">
            <div className="left">
              <span>Country</span>
              <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
              />
              <span>City</span>
              <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
              />
              <button onClick={apply}>Apply</button>
            </div>
            <div className="right">
              <br />
              <span className="sortBy">Sort by</span>
              <span className="sortType">
              {sort === "sales" ? "Best Guide" : sort === "popularity" ? "Popular" : "Newest"}
            </span>
              <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
              {open && (
                  <div className="rightMenu">
                    <span onClick={() => reSort("createdAt")}>Newest</span>
                    <span onClick={() => reSort("sales")}>Best</span>
                    <span onClick={() => reSort("popularity")}>Popular</span>
                  </div>
              )}
            </div>
          </div>
          <div className="cards">
            {isLoading ? (
                "Loading..."
            ) : error ? (
                <div>
                  <p>Something went wrong!</p>
                  <p>Error: {error.message}</p>
                  <p>URL: {error.config.url}</p>
                </div>
            ) : data && data.length > 0 ? (
                data.map((gig) => <GigCard key={gig._id} item={gig} />)
            ) : (
                <p>{noResultsMessage}</p>
            )}
          </div>
          {data && data.length > 0 && <InteractiveMap locations={locations} />}
        </div>
      </div>
  );
}

export default Gigs;