import { Button } from '../components/ui/Button'
import { Empty } from '../components/ui/Primitives'

export default function NotFound() {
  return (
    <section className="section section--top">
      <div className="wrap wrap--narrow">
        <Empty
          icon="help"
          title="That page does not exist"
          body="The link is broken or the page moved. The product tour is the best place to pick things back up."
        >
          <div className="empty__actions">
            <Button to="/" variant="brand" icon="arrow-right">
              Back to home
            </Button>
            <Button to="/product" variant="outline">
              Product tour
            </Button>
          </div>
        </Empty>
      </div>
    </section>
  )
}
