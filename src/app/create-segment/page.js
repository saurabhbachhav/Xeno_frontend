import { Suspense } from "react";
import SegmentPage from "../../components/SegmentPage";

export default function create_segment(){
  return <Suspense>
    <SegmentPage/>
  </Suspense>
}