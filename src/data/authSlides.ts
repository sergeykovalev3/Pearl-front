export const pathToAuthImages = "/images/auth";

export type AuthSlide = {
  readonly src: string;
  readonly quote: string;
  readonly author: string;
  readonly position: string;
};

export const authSlides = [
  {
    src: `${pathToAuthImages}/image1.png`,
    quote:
      '"Effort is like toothpaste; you can usually squeeze out just a little bit more."',
    author: "Dr Andre Jackson",
    position: "Manager of Smile Pvt.Ltd",
  },
  {
    src: `${pathToAuthImages}/image2.jpg`,
    quote:
      "\"From the desk to the chair, every step feels organized—I actually relax before I sit down.\"",
    author: "Nina Alvarez",
    position: "Front Desk & Patient Experience Lead",
  },
  {
    src: `${pathToAuthImages}/image3.jpg`,
    quote:
      "\"When treatment options click on screen, decisions stop feeling rushed—they feel shared and clear.\"",
    author: "Dr. Marcus Webb",
    position: "Clinical Director, Pearl Dental",
  },
  {
    src: `${pathToAuthImages}/image4.jpg`,
    quote:
      "\"Small habits change outcomes; seeing technique on a model turns advice into something you remember.\"",
    author: "Chloe Brennan",
    position: "Registered Dental Hygienist",
  },
  {
    src: `${pathToAuthImages}/image5.jpg`,
    quote:
      "\"Imaging should feel routine, not intimidating—quick positioning and a calm room change the whole visit.\"",
    author: "Omar Hassan",
    position: "Radiology & Imaging Coordinator",
  },
] as const satisfies readonly AuthSlide[];
