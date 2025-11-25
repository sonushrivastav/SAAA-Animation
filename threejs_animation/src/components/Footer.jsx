import Image from "next/image";

export default function Footer() {
  return (
    // <footer className="bg-white      text-black py-10 px-6 md:px-20 border-t border-gray-200">
    //     <div className="flex flex-col md:flex-row items-center justify-between gap-6">
    //         {/* Left: Logo */}
    //         <div className="flex items-center space-x-3">
    //             {/* Logo Icon (replace with your image if you have one) */}
    //             <Image
    //                 src={'/images/Screenshot 2025-10-25 101941-Photoroom.png'}
    //                 width={200}
    //                 height={200}
    //                 alt="logo"
    //             />
    //         </div>

    //         {/* Right: Footer Links */}
    //         <div className="text-gray-700 text-center md:text-right text-sm md:text-base">
    //             Footer / Sitemap / quick links
    //         </div>
    //     </div>
    // </footer>

    <footer className="w-full bg-[#0F0F0F] text-[#FAFAFA] px-6 md:px-16 py-12 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo Section */}
        <div className="flex flex-col gap-4">
          <img
            src="/images/MainLogopurpleblack.svg"
            alt="SAAA Consultants Logo"
            className="w-56 object-contain"
          />
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3 text-lg">
          <a href="/" className="hover:text-purple-400 transition">
            HOME
          </a>
          <a href="/about" className="hover:text-purple-400 transition">
            ABOUT
          </a>
          <a href="/service" className="hover:text-purple-400 transition">
            SERVICES
          </a>
          <a href="/work" className="hover:text-purple-400 transition">
            WORK
          </a>
          <a href="/contact" className="hover:text-purple-400 transition">
            CONTACT
          </a>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col gap-3 text-lg">
          <p>Kanakia Wall Street, Mumbai, India</p>
          <p>+91 7977895134</p>
          <p>info@saaaconsultants.com</p>

          <div className="flex gap-4 mt-3">
            <a className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-purple-600 transition">
              <svg
                width="70"
                height="70"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="70" cy="70" r="20" fill="#1A1A1A" />
                <path d="M14.7 16.2H11.5V28.5H14.7V16.2Z" fill="white" />
                <path
                  d="M13.1 14.7C14.1 14.7 14.9 13.9 14.9 13C14.9 12.1 14.1 11.3 13.1 11.3C12.1 11.3 11.3 12.1 11.3 13C11.3 13.9 12.1 14.7 13.1 14.7Z"
                  fill="white"
                />
                <path
                  d="M22.1 15.9C19.8 15.9 18.4 17.2 18.1 18.2V16.2H15V28.5H18.1V21.6C18.1 20 19.1 19.1 20.4 19.1C21.5 19.1 22.4 19.9 22.4 21.6V28.5H25.6V21.2C25.6 17.8 23.7 15.9 22.1 15.9Z"
                  fill="white"
                />
              </svg>
            </a>
            <a className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-purple-600 transition">
              <svg
                width="70"
                height="70"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="70" cy="70" r="20" fill="#1A1A1A" />
                <path
                  d="M25.7 13H14.3C13.03 13 12 14.03 12 15.3V24.7C12 25.97 13.03 27 14.3 27H25.7C26.97 27 28 25.97 28 24.7V15.3C28 14.03 26.97 13 25.7 13Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="3.3"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx="25" cy="15" r="1.3" fill="white" />
              </svg>
            </a>
            <a className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-purple-600 transition">
              <svg
                width="70"
                height="70"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="70" cy="70" r="20" fill="#1A1A1A" />
                <path
                  d="M21.5 14.3H23.5V11H20.8C18.4 11 17.2 12.4 17.2 14.6V16.7H15V20H17.2V29H20.5V20H23.1L23.5 16.7H20.5V14.8C20.5 14.4 20.9 14.3 21.5 14.3Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-dashed border-[#9C9C9C]  my-10"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-[#fafafa] gap-4">
        <div className="flex items-center gap-4">
          <p>© 2025 SAAA Consultants Pvt. Ltd</p>
          <a href="#" className="hover:text-[#844de9] transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#844de9] transition">
            Cookie Policy
          </a>
          <a href="#" className="hover:text-[#844de9] transition">
            Terms & Conditions
          </a>
        </div>

        <div className="flex items-center  gap-6 text-sm">
          <span>MUMBAI</span>
          <span>SAMBHAJINAGAR</span>
          <span>SINGAPORE</span>
        </div>
      </div>
    </footer>
  );
}
