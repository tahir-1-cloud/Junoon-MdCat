'use client';

import { useEffect, useState } from "react";
import { LecturesModel } from "@/types/lecturesModel";
import { getLectures } from "@/services/lecturesServices";
import ReactPaginate from "react-paginate";

const toEmbedUrl = (url: string): string => {
  try {
    if (url.includes("embed/")) return url;
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
};

export default function CoursesPage() {
  const [lectures, setLectures] = useState<LecturesModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const lecturesPerPage = 6;

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data);
      } catch (error) {
        console.error("Failed to fetch lectures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  const offset = currentPage * lecturesPerPage;
  const currentLectures = lectures.slice(offset, offset + lecturesPerPage);
  const pageCount = Math.ceil(lectures.length / lecturesPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#e6f2ff] via-[#f5faff] to-[#fefefe] py-16">
      <div className="text-center mb-16 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-4 drop-shadow-md">
          🌟 All MDCAT Courses
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Explore all available lectures for MDCAT preparation. Watch videos, view images, and read descriptions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-600 text-lg font-medium">
          Loading lectures...
        </div>
      ) : (
        <>
          {/* Lectures Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
            {currentLectures.map((lecture) => {
              const embedUrl =
                activeVideo === lecture.title
                  ? `${toEmbedUrl(lecture.youtubeUrl)}?autoplay=1&modestbranding=1&rel=0`
                  : "";
              return (
                <div
                  key={lecture.id}
                  className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-blue-100 hover:border-blue-400 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group"
                >
                  {/* Image / Video */}
                  <div className="relative w-full h-64 bg-blue-100 overflow-hidden">
                    {activeVideo === lecture.title ? (
                      <iframe
                        className="w-full h-full"
                        src={embedUrl}
                        title={lecture.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        {lecture.imageUrl ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${lecture.imageUrl}`}
                            alt={lecture.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        <button
                          onClick={() => setActiveVideo(lecture.title)}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <div className="bg-gradient-to-r from-yellow-400 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                            ▶
                          </div>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 text-center relative">
                    <h3 className="text-2xl font-semibold text-[#22418c] mb-2">
                      {lecture.title}
                    </h3>

                    {/* Description with hover */}
                    <div className="relative">
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {lecture.description}
                      </p>
                      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mt-2 w-64 p-3 bg-white border border-gray-200 shadow-lg rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-20">
                        {lecture.description}
                      </div>
                    </div>

                    {/* Video Button */}
                    {activeVideo === lecture.title ? (
                      <button
                        onClick={() => setActiveVideo(null)}
                        className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-400 transition shadow-md mt-2"
                      >
                        ✖ Close Video
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveVideo(lecture.title)}
                        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-md mt-2"
                      >
                        ▶ Watch Lecture
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
       {pageCount > 1 && (
        <div className="flex justify-center mt-12">
            <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"flex items-center space-x-2"}
            pageClassName={"px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors duration-200"}
            pageLinkClassName={"text-gray-700 hover:text-blue-700"}
            previousClassName={"px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors duration-200"}
            previousLinkClassName={"text-gray-700 hover:text-blue-700"}
            nextClassName={"px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors duration-200"}
            nextLinkClassName={"text-gray-700 hover:text-blue-700"}
            breakClassName={"px-4 py-2 text-gray-500"}
            activeClassName={"!bg-blue-600 !text-white shadow-md"}
            activeLinkClassName={"!text-white"}
            disabledClassName={"opacity-40 cursor-not-allowed"}
            disabledLinkClassName={"text-gray-400"}
            />
        </div>
        )}
        </>
      )}
    </section>
  );
}
