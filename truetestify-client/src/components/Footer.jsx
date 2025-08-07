const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; 2025 Truetestify. All rights reserved.</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <a href="/pricing" className="hover:text-primary">Pricing</a>
          <a href="/login" className="hover:text-primary">Login</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;