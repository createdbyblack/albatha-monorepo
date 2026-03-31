export default function DateComponent({dateString}: {dateString: string | undefined}) {
  if (!dateString) {
    return null
  }

  const parsedDate = new Date(dateString)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return (
    <time dateTime={dateString} className="">
      {new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(parsedDate)}
    </time>
  )
}
