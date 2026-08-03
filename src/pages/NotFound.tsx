import { Button } from '../components/ui/Button'
import { Section, Wrap } from '../components/ui/Layout'
import { Empty } from '../components/ui/Primitives'

export default function NotFound() {
  return (
    <Section top>
      <Wrap narrow>
        <Empty
          icon="help"
          title="That page does not exist"
          body="The link is broken or the page moved. The course catalogue is the best place to pick things back up."
        >
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button to="/" variant="brand" icon="arrow-right">
              Back to home
            </Button>
            <Button to="/courses" variant="outline">
              Browse courses
            </Button>
          </div>
        </Empty>
      </Wrap>
    </Section>
  )
}
