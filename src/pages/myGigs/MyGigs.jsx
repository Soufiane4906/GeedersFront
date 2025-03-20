import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// toast.configure();

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();

  // Fetching gigs data
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      toast.success("Gig deleted successfully!");
    },
    onError: () => toast.error("Error deleting gig."),
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const calculateTotalPrice = (gig) => {
    return gig.price + (gig.hasCar ? gig.carPrice : 0) + (gig.hasScooter ? gig.scooterPrice : 0);
  };

  return (
    <div className="container myGigs">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Error fetching gigs"
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Posts</h1>
            {currentUser.isAmbassador && (
              <Link to="/add">
                <button>Add New Post</button>
              </Link>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Stars</th>
                <th>Availability</th>
                <th>Prices</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((gig) => (
                <tr key={gig._id}>
                  <td>
                    <div className="location">
                      <i className="fa fa-map-marker" aria-hidden="true"></i> {gig.city}, {gig.country}
                    </div>
                  </td>
                  <td>
                    <div className="stars">
                      {gig.totalStars > 0 && gig.totalStars <= 5 ? (
                        <>
                          {[...Array(gig.totalStars)].map((_, index) => (
                            <i key={index} className="fa fa-star" aria-hidden="true"></i>
                          ))}
                          {[...Array(5 - gig.totalStars)].map((_, index) => (
                            <i key={index + gig.totalStars} className="fa fa-star-o" aria-hidden="true"></i>
                          ))}
                        </>
                      ) : (
                        <p>No ratings yet</p>
                      )}
                    </div>
                  </td>
                  <td>
                    {gig.availabilityTimes.map((time, index) => (
                      <div key={index}>{new Date(time).toLocaleDateString()}</div>
                    ))}
                  </td>

                  <td>
                    <div>
                      {gig.hasCar && <div>Car: ${gig.carPrice}</div>}
                      {gig.hasScooter && <div>Scooter: ${gig.scooterPrice}</div>}
                      <div>Tour: ${gig.price}</div>
                    </div>
                  </td>
                  <td>
                    <div>Total Price: ${calculateTotalPrice(gig)}</div>
                  </td>
                  <td>
                    <img
                      className="delete"
                      src="./img/delete.png"
                      alt="Delete"
                      onClick={() => handleDelete(gig._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyGigs;
