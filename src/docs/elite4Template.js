/**
 * ? Template for elite4Data
 *
 * ! Main fields:
 * @param {string|undefined} type    Block type: "main" | undefined
 * @param {string} player            Action the player must perform
 * @param {string} warning           Information about warning
 * @param {array}  variations        List of possible variations
 *
 * ! Inside variations:
 * @param {string|undefined} type    Variation type: "step" | undefined
 * @param {string} name              What can happen in this variation (outcome/scenario)
 * @param {array}  steps             Sequence of steps linked to this variation
 *
 * ? General object structure:
 * {
 *   type: "main" | undefined,                   // ! can be undefined
 *   player: "player action",                    // ! what the player must do
 *   warning: "warning message"                  // ? possible warning message
 *   variations: [                               // ? possible outcomes
 *     {
 *       type: "step" | undefined,               // ! can be undefined
 *       name: "what can happen",                // ! scenario / outcome
 *       steps: [
 *         {
 *           type: "main" | undefined,           // ! can be undefined
 *           player: "next player action",       // ! what the player must do
 *           warning: "warning message"          // ? possible warning message
 *           variations: [                       // ? optional sub-scenarios
 *             // more variations here
 *           ],
 *         },
 *       ],
 *     },
 *   ],
 * }
 *
 */
