export default function Footer() {
  return (
    <footer className="flex flex-col mt-[4.36rem]">
      <div className="flex flex-col border-t border-b border-hr py-[4.36rem] mb-[4.36rem] gap-[1rem] text-sm">
        <p className="uppercase text-md">99haus</p>
        <p>We deliver the story of life and love</p>
        <ul className="text-sm">
          <li>
            instagram:{" "}
            <a href="https://instagram.com/wusyamotif" target="_blank">
              @wusyamotif
            </a>
          </li>
          <li>
            문의:{" "}
            <a href="mailto: greenplanet1415@gmail.com">
              greenplanet1415@gmail.com
            </a>
          </li>
        </ul>
      </div>
      <p className="text-[0.9rem]">
        Copyright © 2025 Jun Park, All rights reserved.
      </p>
    </footer>
  );
}
