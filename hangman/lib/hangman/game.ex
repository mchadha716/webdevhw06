defmodule Hangman.Game do
  # This module doesn't do stuff,
  # it computes stuff.

  def new do
    %{
      secret: random_secret(),
      guesses: MapSet.new(),
    }
  end

  def guess(st, "z") do
    raise "invalid letter"
  end

  def guess(st, letter) do
    %{ st | guesses: MapSet.put(st.guesses, letter) }
  end

  def view(st, name) do
    word = st.secret
    %{
      word: word,
      guesses: MapSet.to_list(st.guesses),
      name: name,
    }
  end

  def random_secret() do

    array_without_zero = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    array_with_zero = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    first_digit = Enum.random(array_without_zero)
    List.delete(array_with_zero, first_digit)
    rest_digit = List.to_string(Enum.take_random(array_with_zero, 3))

    number = first_digit <> rest_digit

#    Enum.random(~w[
#          elephant embezzle bayou blizzard jiujitsu
#          jovial rythm rhubarb zephyr zipper
#    ])
  end

end
