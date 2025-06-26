import BannerImage from "../assets/blog-banner2.jpg";

function Banner() {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      <img
        src={BannerImage}
        alt="Blog Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-500 to-blue-700 mb-4 transform hover:scale-105 transition-transform duration-300">
            Welcome to Our Blog
          </h1>
          <p className="text-lg sm:text-xl font-bold text-gray-200">
            Insights, tutorials, and stories to fuel your curiosity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
