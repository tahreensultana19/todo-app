import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <Image
        src="/assets/404.png"
        alt="404 - Page Not Found"
        width={400}
        height={300}
        priority // Add this property for above-the-fold images
        style={{ width: "100", height: "auto" }} // Maintain aspect ratio
      />
      <h1 className="mb-4 text-4xl font-bold text-gray-800">
        404 - Page Not Found
      </h1>
      <h2 className="mb-2 text-gray-1000">
        Sorry, the page you are looking for does not exist.
      </h2>
      <Link href="/" className="text-lg text-yellow-300 hover:underline">
        Go back to Home.
      </Link>
    </div>
  );
}