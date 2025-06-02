import { Suspense } from "react";
import CreatePage from "../../components/CreatePage"

export default function create() {
  return <Suspense>
  <CreatePage></CreatePage>
  </Suspense>
}