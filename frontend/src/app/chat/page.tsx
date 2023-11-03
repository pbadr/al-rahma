export default function Chat() {
	return (
		<main className="p-5">
			<form>
				<div className="mb-3 flex flex-col">
					<label htmlFor="prompt">Enter prompt</label>
					<input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2" type="text" name="prompt" />
				</div>
				<div>
					<button className="text-white bg-blue-700 rounded-lg hover:bg-blue-800 px-5 py-2.5" type="submit">Submit</button>
				</div>
			</form>
		</main>
	)
}