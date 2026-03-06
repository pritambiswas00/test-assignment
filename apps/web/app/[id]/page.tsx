import { notFound, redirect } from "next/navigation"

type LegacyProductPageProps = {
	params: Promise<{
		id: string
	}>
}

export default async function LegacyProductPage({ params }: LegacyProductPageProps) {
	const { id: rawId } = await params
	const id = Number(rawId)

	if (!Number.isInteger(id) || id <= 0) {
		notFound()
	}

	redirect(`/products/${id}`)
}

