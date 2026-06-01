"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function SachinLogoPreloader() {
  const preloaderRef = useRef(null);
  const [svgText, setSvgText] = useState("");
  const [show, setShow] = useState(true);
  const finishPreloader = () => {
    document.documentElement.classList.remove("sachin-preload-active");
    document.documentElement.classList.add("sachin-preload-done");
    document.body.style.overflow = "";
    setShow(false);
  };

  useEffect(() => {
    const safetyUnlock = window.setTimeout(() => {
      finishPreloader();
    }, 6000);

    document.body.style.overflow = "hidden";
    fetch("/sachin-logo.svg")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`SVG file not found. Status: ${res.status}`);
        }

        return res.text();
      })
      .then((text) => {
        if (!text.includes("<svg")) {
          console.error("Loaded file is not SVG:", text.slice(0, 200));
          finishPreloader();
          return;
        }

        setSvgText(text);
      })
      .catch((error) => {
        console.error("SVG loading failed:", error);
        finishPreloader();
      });
    return () => {
      window.clearTimeout(safetyUnlock);
      document.documentElement.classList.remove("sachin-preload-active");
      document.documentElement.classList.add("sachin-preload-done");
      document.body.style.overflow = "";
    };
  }, [show]);

  useGSAP(
    () => {
      if (!svgText || !preloaderRef.current) return;

      const root = preloaderRef.current;
      const svg = root.querySelector("svg");

      if (!svg) {
        console.error("SVG not found inside preloader");
        return;
      }

      const shapeSelector =
        "path, polygon, rect, circle, ellipse, line, polyline, image";

      const getById = (id) => {
        return (
          root.querySelector(`[id="${id}"]`) ||
          root.querySelector(`[data-name="${id}"]`)
        );
      };

      const getOneFromIds = (ids) => {
        for (const id of ids) {
          const element = getById(id);
          if (element) return element;
        }

        return null;
      };

      const getShapesInside = (id) => {
        const element = getById(id);

        if (!element) {
          console.warn("Missing SVG selector:", id);
          return [];
        }

        const tag = element.tagName?.toLowerCase();

        if (
          tag === "path" ||
          tag === "polygon" ||
          tag === "rect" ||
          tag === "circle" ||
          tag === "ellipse" ||
          tag === "line" ||
          tag === "polyline" ||
          tag === "image"
        ) {
          return [element];
        }

        return gsap.utils.toArray(element.querySelectorAll(shapeSelector));
      };

      const unique = (items) => [...new Set(items.filter(Boolean))];

      const circleOutline = getOneFromIds(["circle-outline"]);

      const circleHalfOutline = getOneFromIds([
        "circle-half-outline",
        "circle half-outline",
      ]);

      const orangeBackground = getOneFromIds(["orange-background"]);

      const personImage = getOneFromIds(["person-image"]);

      const imageOutline = getOneFromIds(["image-outline"]);

      const outlineShapes = unique([
        ...getShapesInside("s-outline"),
        ...getShapesInside("a-outline"),
        ...getShapesInside("n-outline"),
        ...getShapesInside("l-outline"),
        ...getShapesInside("v-outline"),
        ...getShapesInside("t-outline"),
        ...getShapesInside("e-outline"),
      ]);

      const fillShapes = unique([
        ...getShapesInside("s-fill"),
        ...getShapesInside("a-fill"),
        ...getShapesInside("n-fill"),
        ...getShapesInside("l-fill"),
        ...getShapesInside("v-fill"),
        ...getShapesInside("t-fill"),
        ...getShapesInside("e-fill"),
      ]);

      gsap.set(svg, {
        autoAlpha: 1,
        transformOrigin: "center center",
      });

      const hiddenParts = [
        circleOutline,
        circleHalfOutline,
        orangeBackground,
        personImage,
        imageOutline,
      ].filter(Boolean);

      if (hiddenParts.length) {
        gsap.set(hiddenParts, {
          autoAlpha: 0,
          visibility: "hidden",
        });
      }

      const circleOutlineParts = [circleOutline, circleHalfOutline].filter(
        Boolean
      );

      if (circleOutlineParts.length) {
        gsap.set(circleOutlineParts, {
          scale: 0.96,
          transformOrigin: "center center",
        });
      }

      if (orangeBackground) {
        gsap.set(orangeBackground, {
          scale: 0.96,
          transformOrigin: "center center",
        });
      }

      if (imageOutline) {
        gsap.set(imageOutline, {
          scale: 0.96,
          transformOrigin: "center center",
        });
      }

      if (personImage) {
        gsap.set(personImage, {
          filter: "blur(8px)",
        });
      }

      if (fillShapes.length) {
        gsap.set(fillShapes, {
          autoAlpha: 0,
          y: 18,
          filter: "blur(8px)",
        });
      }

      if (outlineShapes.length) {
        gsap.set(outlineShapes, {
          autoAlpha: 1,
          visibility: "visible",
        });

        outlineShapes.forEach((shape) => {
          if (typeof shape.getTotalLength !== "function") return;

          try {
            const length = shape.getTotalLength();

            gsap.set(shape, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          } catch (error) {
            console.warn("Could not prepare outline draw:", shape, error);
          }
        });
      }

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        onComplete: () => {
          finishPreloader();
        },
      });

      if (circleOutlineParts.length) {
        tl.to(circleOutlineParts, {
          autoAlpha: 1,
          visibility: "visible",
          scale: 1,
          duration: 0.35,
          stagger: 0,
          ease: "power3.out",
        });
      }

      if (orangeBackground) {
        tl.to(orangeBackground, {
          autoAlpha: 1,
          visibility: "visible",
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        });
      }

      tl.add("outlineStart");

      if (imageOutline) {
        tl.to(
          imageOutline,
          {
            autoAlpha: 1,
            visibility: "visible",
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          "outlineStart"
        );
      }

      if (outlineShapes.length) {
        tl.to(
          outlineShapes,
          {
            strokeDashoffset: 0,
            duration: 1.25,
            stagger: 0.025,
          },
          "outlineStart"
        );
      }

      if (personImage) {
        tl.to(personImage, {
          autoAlpha: 1,
          visibility: "visible",
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        });
      }

      if (imageOutline) {
        tl.to(
          imageOutline,
          {
            autoAlpha: 0,
            visibility: "hidden",
            duration: 0.25,
            ease: "power2.out",
          },
          "-=0.1"
        );
      }

      tl.add("fillStart");

      if (fillShapes.length) {
        tl.to(
          fillShapes,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            stagger: 0.07,
            ease: "power3.out",
          },
          "fillStart"
        );
      }

      if (outlineShapes.length) {
        tl.to(
          outlineShapes,
          {
            autoAlpha: 0,
            duration: 0.22,
            ease: "power2.out",
          },
          "fillStart"
        ).set(outlineShapes, {
          autoAlpha: 0,
          visibility: "hidden",
        });
      }

      tl.to({}, { duration: 1 }).to(preloaderRef.current, {
        autoAlpha: 0,
        scale: 1.04,
        duration: 0.75,
        ease: "power2.inOut",
      });

      return () => {
        tl.kill();
      };
    },
    {
      scope: preloaderRef,
      dependencies: [svgText],
    }
  );

  if (!show) return null;

  return (
    <>
      <div ref={preloaderRef} className="sachin-preloader">
        <div
          className="sachin-logo-wrap"
          dangerouslySetInnerHTML={{ __html: svgText }}
        />
      </div>
      <style jsx global>{`
        .sachin-preloader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f7941d;
          overflow: hidden;
          cursor: pointer;
        }

        .sachin-preloader::before {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.08);
          filter: blur(95px);
        }

        .sachin-logo-wrap {
          position: relative;
          z-index: 2;
          width: min(1100px, 94vw);
        }

        .sachin-logo-wrap svg {
          width: 100%;
          height: auto;
          display: block;
          overflow: visible;
        }

        .sachin-logo-wrap #circle-outline,
        .sachin-logo-wrap #orange-background,
        .sachin-logo-wrap #person-image,
        .sachin-logo-wrap [id="circle-half-outline"],
        .sachin-logo-wrap [id="circle half-outline"] {
          opacity: 0;
          visibility: hidden;
        }

        .sachin-logo-wrap #circle-outline,
        .sachin-logo-wrap #circle-half-outline,
        .sachin-logo-wrap #orange-background,
        .sachin-logo-wrap #person-image,
        .sachin-logo-wrap #image-outline,
        .sachin-logo-wrap [id="circle half-outline"] {
          opacity: 0;
          visibility: hidden;
        }
      `}</style>
    </>
  );
}
