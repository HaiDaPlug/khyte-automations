import ServiceScene from "@/components/scenes/ServiceScene";
import SectionHeading from "@/components/SectionHeading";
import ExampleScroller from "@/components/sections/ExampleScroller";
import { exampleCaseHref, type ServiceData } from "@/data/services";

/**
 * Server side of the examples section: resolves the case links (which read
 * cases.ts and fail the build on a bad slug) and renders the scenes, then hands
 * plain data and the rendered scenes to <ExampleScroller />, which does the
 * scrolling. Each scene is rendered twice: filling the sticky stage on desktop
 * and as an inline card on mobile; only one of the two is ever displayed.
 */
export default function ServiceExamples({ service }: { service: ServiceData }) {
  const examples = service.examples;

  return (
    <ExampleScroller
      heading={
        <SectionHeading
          line1={service.examplesHeading.line1}
          line2={service.examplesHeading.line2}
          intro={service.examplesIntro}
        />
      }
      examples={examples.map((ex) => {
        const href = exampleCaseHref(service, ex);
        return {
          title: ex.title,
          summary: ex.summary,
          tag: ex.tag,
          hypothetical: ex.hypothetical,
          link: href && ex.case ? { href, text: ex.case.linkText } : null,
        };
      })}
      stageScenes={examples.map((ex) => (
        <ServiceScene key={ex.scene} id={ex.scene} fill />
      ))}
      inlineScenes={examples.map((ex) => (
        <ServiceScene key={ex.scene} id={ex.scene} />
      ))}
    />
  );
}
