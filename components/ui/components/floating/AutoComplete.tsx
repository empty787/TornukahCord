import { For, JSX, Match, Show, Switch } from "solid-js";
import { styled } from "solid-styled-components";

import { ServerMember } from "revolt.js";

import { CustomEmoji, UnicodeEmoji } from "@revolt/markdown/emoji";

import { AutoCompleteState } from "../../directives";
import { Avatar, Column, Row } from "../design";

/**
 * Auto complete popup
 */
export function AutoComplete(
  props: Exclude<JSX.Directives["floating"]["autoComplete"], undefined>
) {
  return (
    <Base>
      <Switch>
        <Match when={props.state().matched === "emoji"}>
          <For
            each={
              (props.state() as AutoCompleteState & { matched: "emoji" })
                .matches
            }
          >
            {(match, index) => (
              <Entry align selected={index() === props.selection()}>
                <Switch
                  fallback={
                    <>
                      <UnicodeEmoji
                        emoji={(match as { codepoint: string }).codepoint}
                      />{" "}
                      <Name>:{match.shortcode}:</Name>
                    </>
                  }
                >
                  <Match when={match.type === "custom"}>
                    <CustomEmoji id={(match as { id: string }).id} />{" "}
                    <Name>:{match.shortcode}:</Name>
                  </Match>
                </Switch>
              </Entry>
            )}
          </For>
        </Match>
        <Match when={props.state().matched === "user"}>
          <For
            each={
              (
                props.state() as AutoCompleteState & {
                  matched: "user";
                }
              ).matches
            }
          >
            {(match, index) => (
              <Entry align selected={index() === props.selection()}>
                <Avatar src={match.user.animatedAvatarURL} size={24} />{" "}
                <Name>{match.user.username}</Name>
                {match.user instanceof ServerMember &&
                  match.user.username !== match.user.user?.username && (
                    <> @{match.user.user?.username}</>
                  )}
              </Entry>
            )}
          </For>
        </Match>
        <Match when={props.state().matched === "channel"}>
          <For
            each={
              (
                props.state() as AutoCompleteState & {
                  matched: "channel";
                }
              ).matches
            }
          >
            {(match, index) => (
              <Entry align selected={index() === props.selection()}>
                <Name>#{match.channel.name}</Name>
              </Entry>
            )}
          </For>
        </Match>
      </Switch>
    </Base>
  );
}

/**
 * Individual auto complete entry
 */
const Entry = styled(Row)<{ selected: boolean }>`
  cursor: pointer;
  background: ${(props) =>
    props.selected ? props.theme!.colours["background-300"] : "transparent"};
`;

/**
 * Entry name
 */
const Name = styled.div`
  font-size: 0.9em;
  color: ${(props) => props.theme!.colours["foreground-200"]};
`;

/**
 * Auto complete container
 */
const Base = styled(Column)`
  --emoji-size: 1.4em;

  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours["background-100"]};
`;
