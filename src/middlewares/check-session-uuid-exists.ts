import type { FastifyReply, FastifyRequest } from 'fastify';

export async function checkSessionUuidExists(request: FastifyRequest, reply: FastifyReply) {
  const sessionUuid = request.cookies.sessionUuid;

  if (!sessionUuid) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    });
  }
}
