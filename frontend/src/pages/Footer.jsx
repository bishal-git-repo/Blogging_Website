function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-6">
      <ul className="flex justify-center space-x-6 mb-4">
        <li>
          <a href="/" className="hover:underline">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="hover:underline">
            About
          </a>
        </li>
        <li>
          <a href="/blogs" className="hover:underline">
            Blogs
          </a>
        </li>
      </ul>
      <p className="text-sm">&copy; 2024 My Blog. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
