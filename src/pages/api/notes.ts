import { Redis } from '@upstash/redis';
import type { APIRoute } from 'astro';
import type { Note } from '../../types';
import { getDomainUrl } from '~utilities/utilities';

const HASHSET_KEY = 'notes';
const url = import.meta.env.UPSTASH_REDIS_REST_URL;
const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;

const redis = new Redis({ url, token });

export const get: APIRoute = async function get() {
	try {
		const notes: Record<string, Note> | null = await redis.hgetall(HASHSET_KEY);
		/* notes (when not null) has structure:
				{
					'1660841122914': { // this is the note id
						title: 'First One',
						text: 'First text',
						modified: '2022-08-18T16:45:22.914Z'
					},
					'1660843285978': {
						title: 'Second one',
						text: 'Hi',
						modified: '2022-08-18T17:21:25.978Z'
					}
				}
		*/

		if (notes) {
			const sortedNotes: Note[] = Object.entries(notes)
				.map(([id, { title, text, modified }]) => ({
					id,
					title,
					text,
					modified,
				}))
				.sort((a, b) => Date.parse(b.modified) - Date.parse(a.modified));

			return new Response(JSON.stringify({ notes: sortedNotes }), {
				headers: { "content-type": "application/json" },
				status: 200,
			});
		}

		return new Response(JSON.stringify({ notes: [] }), {
			headers: { "content-type": "application/json" },
			status: 200,
		});
	} catch (error: unknown) {
		console.error(`Error in /api GET method: ${error as string}`);
		return new Response(JSON.stringify({ notes: [] }), {
			headers: { "content-type": "application/json" },
			status: 200,
		});
	}
};

export const post: APIRoute = async function post({ request }) {
	try {
		const form = await request.formData();
		const action = form.get("action");
		const redirectURL: string = getDomainUrl(request);
		const urlParams = new URLSearchParams();

		switch (action) {
			case "create": {
				const date = new Date();
				const id = date.getTime();
				const modified = date.toISOString();
				const note = {
					title: "Untitled",
					text: "",
					modified,
				};
				await redis.hset(HASHSET_KEY, {
					[id]: JSON.stringify(note),
				});
				urlParams.append("edit", "true");
				urlParams.append("note", id.toString(10));

				break;
			}
			case "update": {
				const id = form.get("id") as string;
				const title = form.get("title");
				const text = form.get("text");
				const modified = new Date().toISOString();

				await redis.hset(HASHSET_KEY, {
					[id]: JSON.stringify({ title, text, modified }),
				});
				urlParams.append("note", id);
				break;
			}
			case "delete": {
				const id = form.get("id");
				if (typeof id === "string") {
					await redis.hdel(HASHSET_KEY, id);
				}
				break;
			}
			default:
		}
		return Response.redirect(`${redirectURL}?${urlParams.toString()}`);
	} catch (error: unknown) {
		console.error(`Error in /api PUT method: ${error as string}`);
		return Response.redirect(getDomainUrl(request));
	}
};
