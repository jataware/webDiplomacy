<?php
namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

require_once(__DIR__.'/../jata_functions.php');

class JataFunctionsTest extends TestCase
{
    /**
     * @test
     */
    public function returnsHi(): void
    {
        $result = test();

        $this->assertTrue($result == "hit");
    }
}
